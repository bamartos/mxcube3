import logging

import signals

from flask import Response, jsonify, request
from mxcube3 import app as mxcube
from . import limsutils
from . import scutils

from .qutils import UNCOLLECTED
from .scutils import set_current_sample


def init_signals():
    """Initialize hwobj signals."""
    mxcube.sample_changer.connect('stateChanged', signals.sc_state_changed)


@mxcube.route("/mxcube/api/v0.1/sample_changer/samples_list", methods=['GET'])
def get_samples_list():
    samples_list = mxcube.sample_changer.getSampleList()
    samples = {}
    samplesByCoords = {}
    order = []

    for s in samples_list:
        sample_dm = s.getID() or ""
        coords = s.getCoords()
        sample_data = {"sampleID": s.getAddress(),
                       "location": ":".join(map(str, coords)),
                       "sampleName": "Sample-%s" % s.getAddress().replace(':', ''),
                       "code": sample_dm,
                       "loadable": True,
                       "state": UNCOLLECTED,
                       "tasks": [],
                       "type": "Sample"}
        order.append(coords)
        samplesByCoords[coords] = sample_data['sampleID']

        sample_data["defaultPrefix"] = limsutils.get_default_prefix(sample_data, False)

        samples[s.getAddress()] = sample_data

    # sort by location, using coords tuple
    order.sort()

    return jsonify({ 'sampleList': samples, 'sampleOrder': [samplesByCoords[coords] for coords in order] })

@mxcube.route("/mxcube/api/v0.1/sample_changer/contents", methods=['GET'])
def get_sc_contents():
    def _getElementStatus(e):
        if e.isLeaf():
            if e.isLoaded():
                return "Loaded"
            if e.hasBeenLoaded():
                return "Used"
        if e.isPresent():
            return "Present"
        return ""

    def _getElementID(e):
        if e == mxcube.sample_changer:
            if e.getToken() is not None:
                return e.getToken()
        else:
            if e.getID() is not None:
                return e.getID()
        return ""

    def _addElement(parent, element):
        new_element = { "name": element.getAddress(),
                        "status": _getElementStatus(element),
                        "id":_getElementID(element),
                        "selected": element.isSelected() }

        parent.setdefault("children", []).append(new_element)

        if not element.isLeaf():
          for e in element.getComponents():
            _addElement(new_element, e)

    root_name = mxcube.sample_changer.getAddress()

    contents = { "name": root_name }

    for element in mxcube.sample_changer.getComponents():
        _addElement(contents, element)

    return jsonify(contents)

@mxcube.route("/mxcube/api/v0.1/sample_changer/select/<loc>", methods=['GET'])
def select_location(loc):
    mxcube.sample_changer.select(loc)
    return get_sc_contents()

@mxcube.route("/mxcube/api/v0.1/sample_changer/scan/<loc>", methods=['GET'])
def scan_location(loc):
    # do a recursive scan
    mxcube.sample_changer.scan(loc, True)
    return get_sc_contents()

@mxcube.route("/mxcube/api/v0.1/sample_changer/mount/<loc>", methods=['GET'])
def mount_sample(loc):
    mxcube.sample_changer.load(loc)
    set_current_sample(loc)
    return get_sc_contents()

@mxcube.route("/mxcube/api/v0.1/sample_changer/unmount/<loc>", methods=['GET'])
def unmount_sample(loc):
    mxcube.sample_changer.unload(loc)
    set_current_sample('')
    return get_sc_contents()

@mxcube.route("/mxcube/api/v0.1/sample_changer/mount", methods=["POST"])
def mount_sample_clean_up():
    try:
        scutils.mount_sample_clean_up(request.get_json())
    except Exception:
        return Response(status=409)
    else:
        return Response(status=200)

@mxcube.route("/mxcube/api/v0.1/sample_changer/unmount", methods=['POST'])
def unmount_sample_clean_up():
    try:
        scutils.unmount_sample_clean_up(request.get_json())
    except Exception:
        return Response(status=409)
    else:
        return Response(status=200)
